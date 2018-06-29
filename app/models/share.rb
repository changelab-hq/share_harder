class Share < ApplicationRecord
  belongs_to :variant
  has_one :experiment, through: :variant
  belongs_to :share, optional: true

  after_create :increment_shares

  def increment_shares
    variant.share_counter.increment
  end

  def add_click
    # Atomic database increment
    Share.connection.execute("UPDATE shares SET click_count = click_count + 1 WHERE id = #{id}")
    variant.click_counter.increment
  end

  def add_goal
    # Atomic database increment
    Share.connection.execute("UPDATE shares SET goal_count = goal_count + 1 WHERE id = #{id}")
    variant.goal_counter.increment
  end
end
