class Api::ApiController < ApplicationController
  protect_from_forgery except: [:variant, :record_goal]

  def variant
    lookup_url = params[:experiment_url].presence || request.referer

    experiment = Experiment.lookup_by_url(lookup_url)
    if experiment
      variant = experiment.choose_bandit_variant
      data = variant.attributes.slice('id', 'experiment_id', 'description', 'title', 'image_url')
      data['has_overlays'] = variant.template_image.overlays.present?
      render json: data
    else
      render json: {}, status: 404
    end
  end

  def record_goal
    AddGoalWorker.perform_async(params[:key], Time.now)
  end
end
