class AddGoalWorker
  include Sidekiq::Worker

  def perform(key)
    Share.find_by(key: key).add_goal
  end
end
