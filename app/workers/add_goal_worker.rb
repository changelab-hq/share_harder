class AddGoalWorker
  include Sidekiq::Worker

  def perform(key, goal_at)
    click = Click.find_by(key: key)
    click.update!(goal_at: goal_at)
    click.share.increment_goals
  end
end
