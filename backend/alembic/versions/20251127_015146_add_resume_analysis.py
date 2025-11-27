"""add resume_analysis table

Revision ID: 20251127_015146
Revises: da04fabf6fca
Create Date: 2025-01-27 01:51:46.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20251127_015146'
down_revision = 'da04fabf6fca'  # Update this to your latest migration
branch_labels = None
depends_on = None


def upgrade():
    """Create resume_analysis table"""
    op.create_table(
        'resume_analysis',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('resume_id', sa.Integer(), nullable=False),
        sa.Column('score', sa.Integer(), nullable=True),
        sa.Column('strengths', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('missing_skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('suggestions', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('analyzed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['resume_id'], ['resumes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for better query performance
    op.create_index('ix_resume_analysis_id', 'resume_analysis', ['id'])
    op.create_index('ix_resume_analysis_resume_id', 'resume_analysis', ['resume_id'])
    op.create_index('ix_resume_analysis_status', 'resume_analysis', ['status'])


def downgrade():
    """Drop resume_analysis table"""
    op.drop_index('ix_resume_analysis_status', table_name='resume_analysis')
    op.drop_index('ix_resume_analysis_resume_id', table_name='resume_analysis')
    op.drop_index('ix_resume_analysis_id', table_name='resume_analysis')
    op.drop_table('resume_analysis')
