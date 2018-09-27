class Share < ApplicationRecord
  belongs_to :variant
  has_one :experiment, through: :variant
  belongs_to :share, optional: true
  has_many :clicks

  validates_presence_of :key, :experiment, :variant

  after_create :increment_shares

  def increment_shares
    variant.share_counter.increment
  end

  def increment_clicks
    # Atomic database increment
    Share.connection.execute("UPDATE shares SET click_count = click_count + 1, updated_at = current_timestamp WHERE id = #{id}")
    variant.click_counter.increment
  end

  def increment_goals
    # Atomic database increment
    Share.connection.execute("UPDATE shares SET goal_count = goal_count + 1, updated_at = current_timestamp WHERE id = #{id}")

    # This could result in overcounting if a race condition occurs.
    # We fix this by running a separate process that calculates the correct value
    variant.allowed_goal_counter.increment if goal_count < 5
  end
end
