"""create tests table

Revision ID: f9ee08773633
Revises: 
Create Date: 2025-06-11 23:27:20.053024

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9ee08773633'
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
