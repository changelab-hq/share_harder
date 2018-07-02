class Api::ApiController < ApplicationController
  protect_from_forgery except: [:variant, :record_goal]

  def variant
    experiment = Experiment.lookup_by_url(request.referer)
    if experiment
      variant = experiment.choose_bandit_variant
      render json: variant
    else
      render json: {}, status: 404
    end
  end

  def record_goal
    AddGoalWorker.perform_async(params[:key])
  end
end
