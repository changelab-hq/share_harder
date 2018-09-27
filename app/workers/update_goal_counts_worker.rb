class UpdateGoalCountsWorker
  include Sidekiq::Worker

  def perform
    Share.where("updated_at > ?", 2.minutes.ago).select(:variant_id).distinct.each do |share|
      share.variant.refresh_allowed_goal_counter
    end
  end
end
