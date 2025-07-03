"""create tests table

Revision ID: 2000_01_01_0000
Revises:
Create Date: 2000-01-01 00:00:00.000000

"""

from typing import Sequence, Union


from alembic import op

# revision identifiers, used by Alembic.
revision: str = "f9ee08773633"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE tests (
            id INTEGER PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
        """
    )


def downgrade() -> None:
    op.execute("DROP TABLE tests")
