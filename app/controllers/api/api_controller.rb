class Api::ApiController < ApplicationController
  protect_from_forgery except: [:variant, :record_goal]

  def variant
    p params[:experiment_url]
    lookup_url = params[:experiment_url].presence || request.referer
    
    experiment = Experiment.lookup_by_url(lookup_url)
    if experiment
      variant = experiment.choose_bandit_variant
      render json: variant
    else
      render json: {}, status: 404
    end
  end

  def record_goal
    AddGoalWorker.perform_async(params[:key], Time.now)
  end
end
