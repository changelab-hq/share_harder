class UpdateGoalCounters < ActiveRecord::Migration[5.2]
  def change
    Variant.all.each { |v| v.refresh_allowed_goal_counter }
  end
end
