class Api::ApiController < ApplicationController
  protect_from_forgery except: [:variant, :record_goal]

  def variant
    lookup_url = params[:experiment_url].presence || request.referer

    experiment = Experiment.lookup_by_url(lookup_url)
    if experiment
      variant = experiment.choose_bandit_variant
      data = variant.attributes.slice('id', 'experiment_id', 'description', 'title', 'prefill_text')
      data['image_url'] = variant.template_image['url']
      data['has_overlays'] = variant.template_image.overlays.present?
      render json: data
    else
      render json: {}, status: 404
    end
  end

  def register_share
    lookup_url = params[:experiment_url].presence || request.referer
    experiment = Experiment.lookup_by_url(lookup_url)

    experiment.get_share_by_key(params[:key], params[:v], params[:rkey])
  end

  def record_goal
    AddGoalWorker.perform_async(params[:key], Time.now)
  end
end
