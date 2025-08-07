import { NextRequest, NextResponse } from "next/server"
import axios, { AxiosResponse, Method } from "axios"

// Proxy all requests to FastAPI backend
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyToFastAPI(request, resolvedParams.path, "GET")
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyToFastAPI(request, resolvedParams.path, "POST")
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyToFastAPI(request, resolvedParams.path, "PUT")
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyToFastAPI(request, resolvedParams.path, "DELETE")
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  return proxyToFastAPI(request, resolvedParams.path, "PATCH")
}

async function proxyToFastAPI(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  // Get FastAPI URL from environment (outside try block for error handling)
  const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_SERVER
  if (!fastApiUrl) {
    return NextResponse.json(
      { error: "FastAPI URL not configured" },
      { status: 500 }
    )
  }

  // Construct the target URL
  const path = pathSegments.join("/")
  const searchParams = request.nextUrl.searchParams.toString()
  const targetUrl = `${fastApiUrl}/${path}${searchParams ? `?${searchParams}` : ""}`

  console.log(`[FastAPI Proxy] ${method} ${targetUrl}`)
  console.log(`[FastAPI Proxy] FastAPI URL: ${fastApiUrl}`)

  try {
    // Prepare headers (exclude problematic headers for axios)
    const headers: Record<string, string> = {}
    const excludeHeaders = new Set([
      "host",
      "connection",
      "content-length",
      "transfer-encoding",
      "x-forwarded-for",
      "x-forwarded-proto",
      "x-forwarded-host",
    ])

    request.headers.forEach((value, key) => {
      if (!excludeHeaders.has(key.toLowerCase())) {
        headers[key] = value
      }
    })

    // Prepare request body for non-GET requests
    let data: unknown = undefined
    if (method !== "GET" && method !== "HEAD") {
      try {
        const bodyText = await request.text()
        // Try to parse as JSON, otherwise keep as string
        if (bodyText) {
          try {
            data = JSON.parse(bodyText)
          } catch {
            data = bodyText
          }
        }
      } catch (error) {
        console.warn("Could not read request body:", error)
      }
    }

    // Make the request to FastAPI using axios
    const response: AxiosResponse = await axios({
      method: method.toLowerCase() as Method,
      url: targetUrl,
      headers,
      data,
      validateStatus: () => true, // Don't throw on HTTP error status codes
      timeout: 30000, // 30 second timeout
    })

    // Create response headers (exclude problematic ones)
    const responseHeaders = new Headers()
    const excludeResponseHeaders = new Set([
      "connection",
      "transfer-encoding",
      "content-encoding",
    ])

    Object.entries(response.headers).forEach(([key, value]) => {
      if (
        !excludeResponseHeaders.has(key.toLowerCase()) &&
        typeof value === "string"
      ) {
        responseHeaders.set(key, value)
      }
    })

    // Return the response
    return NextResponse.json(response.data, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Proxy error:", error)

    // Handle axios-specific errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          `[FastAPI Proxy] HTTP Error ${error.response.status}:`,
          error.response.data
        )
        return NextResponse.json(
          error.response.data || { error: "FastAPI request failed" },
          { status: error.response.status }
        )
      } else if (error.request) {
        // The request was made but no response was received
        console.error(`[FastAPI Proxy] Network Error:`, error.message)
        return NextResponse.json(
          {
            error: "Unable to connect to FastAPI server",
            details: `FastAPI server at ${fastApiUrl} is not responding. Please check if the server is running.`,
            url: targetUrl,
          },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      {
        error: "Proxy request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
