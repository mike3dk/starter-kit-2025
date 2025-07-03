"""create better auth users table

Revision ID: acc64cf8fef4
Revises: f9ee08773633
Create Date: 2025-06-26 22:14:56.314403

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "acc64cf8fef4"
down_revision: Union[str, None] = "f9ee08773633"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE public.users (
            id text NOT NULL,
            name text NOT NULL,
            email text NOT NULL,
            "emailVerified" bool NOT NULL,
            image text NULL,
            "createdAt" timestamp(3) NOT NULL,
            "updatedAt" timestamp(3) NOT NULL,
            CONSTRAINT users_pkey PRIMARY KEY (id)
        );
        CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
        
        CREATE TABLE public.sessions (
            id text NOT NULL,
            "expiresAt" timestamp(3) NOT NULL,
            "token" text NOT NULL,
            "createdAt" timestamp(3) NOT NULL,
            "updatedAt" timestamp(3) NOT NULL,
            "ipAddress" text NULL,
            "userAgent" text NULL,
            "userId" text NOT NULL,
            CONSTRAINT sessions_pkey PRIMARY KEY (id),
            CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
        CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING btree (token);

        CREATE TABLE public.accounts (
            id text NOT NULL,
            "accountId" text NOT NULL,
            "providerId" text NOT NULL,
            "userId" text NOT NULL,
            "accessToken" text NULL,
            "refreshToken" text NULL,
            "idToken" text NULL,
            "accessTokenExpiresAt" timestamp(3) NULL,
            "refreshTokenExpiresAt" timestamp(3) NULL,
            "scope" text NULL,
            "password" text NULL,
            "createdAt" timestamp(3) NOT NULL,
            "updatedAt" timestamp(3) NOT NULL,
            CONSTRAINT accounts_pkey PRIMARY KEY (id),
            CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE public.verifications (
            id text NOT NULL,
            identifier text NOT NULL,
            value text NOT NULL,
            "expiresAt" timestamp(3) NOT NULL,
            "createdAt" timestamp(3) NULL,
            "updatedAt" timestamp(3) NULL,
            CONSTRAINT verifications_pkey PRIMARY KEY (id)
        );
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS verifications;
        DROP TABLE IF EXISTS accounts;
        DROP TABLE IF EXISTS sessions;
        DROP TABLE IF EXISTS users;
        """
    )
