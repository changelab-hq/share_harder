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
    Share.connection.execute("UPDATE shares SET click_count = click_count + 1 WHERE id = #{id}")
    variant.click_counter.increment
  end

  def increment_goals
    # Atomic database increment
    Share.connection.execute("UPDATE shares SET goal_count = goal_count + 1 WHERE id = #{id}")
    variant.goal_counter.increment
  end
end
