"""create users table

Revision ID: acc64cf8fef4
Revises: f9ee08773633
Create Date: 2025-06-26 22:14:56.314403

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'acc64cf8fef4'
down_revision: Union[str, None] = 'f9ee08773633'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE users (
            id TEXT PRIMARY KEY DEFAULT generate_short_id(),
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            email_verified BOOLEAN NOT NULL DEFAULT FALSE,
            image TEXT,
            createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE sessions (
            id TEXT PRIMARY KEY DEFAULT generate_short_id(),
            userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL UNIQUE,
            ipAddress TEXT,
            userAgent TEXT,
            createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE accounts (
            id TEXT PRIMARY KEY DEFAULT generate_short_id(),
            userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            providerId TEXT NOT NULL,
            accessToken TEXT,
            refreshToken TEXT,
            accessTokenExpiresAt TIMESTAMP WITH TIME ZONE,
            refreshTokenExpiresAt TIMESTAMP WITH TIME ZONE,
            scope TEXT,
            idToken TEXT,
            password TEXT,
            createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE verifications (
            id TEXT PRIMARY KEY DEFAULT generate_short_id(),
            identifier TEXT NOT NULL,
            value TEXT NOT NULL,
            expiresAt TIMESTAMP WITH TIME ZONE NOT NULL,
            createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TRIGGER update_user_updated_at
            BEFORE UPDATE ON users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER update_session_updated_at  
            BEFORE UPDATE ON sessions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER update_account_updated_at
            BEFORE UPDATE ON accounts
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER update_verification_updated_at
            BEFORE UPDATE ON verifications
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        """
    )




def downgrade() -> None:
    op.execute(
        """
        DROP TRIGGER IF EXISTS update_session_updated_at ON sessions;
        DROP TRIGGER IF EXISTS update_user_updated_at ON users;
        DROP TRIGGER IF EXISTS update_account_updated_at ON accounts;
        DROP TRIGGER IF EXISTS update_verification_updated_at ON verifications;
        DROP TABLE IF EXISTS verifications;
        DROP TABLE IF EXISTS accounts;
        DROP TABLE IF EXISTS sessions;
        DROP TABLE IF EXISTS users;
        """
    )
