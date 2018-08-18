class ExperimentsController < ApplicationController
  before_action :authenticate_admin, except: [:metatags, :redirect, :lookup, :preview_image, :share]
  before_action :set_experiment
  before_action :check_for_key_param, only: [:metatags, :redirect]

  def index
    @experiments = Experiment.all
  end

  def new
    @experiment = Experiment.new
  end

  def create
    experiment = Experiment.create!(experiment_params)
    redirect_to edit_experiment_path(experiment)
  end

  def edit
    @experiment_props = data_for_experiment
  end

  def update
    @experiment.update_attributes(experiment_params.to_h)
    render json: data_for_experiment
  end

  def results
    @experiment_props = { experiment: @experiment.results }
  end

  def demo
  end

  def share
    if params[:test].present?
      key = 'test'
    else
      key = SecureRandom.hex(16)
    end

    url = e_url(@experiment, params: request.query_parameters.merge({ key: key }))
    redirect_to "https://www.facebook.com/sharer.php?u=#{CGI.escape(url)}"
  end

  def metatags
    if params[:key] == 'test'
      @share = Share.new(variant: @experiment.variants.sample)
    else
      @share = @experiment.get_share_by_key(params[:key], params[:v], params[:r])
    end

    @metatags = @share.variant.render_metatags(params)
    render layout: false
  end

  def redirect
    redirect_to "https://#{@experiment.url}" if params[:key] == 'test'

    click_key = Click.generate_key
    AddClickWorker.perform_async(params[:key], click_key, request.user_agent, request.remote_ip)
    Rails.logger.info(request.user_agent)
    Rails.logger.info(request.headers)
    redirect_to("https://#{@experiment.url}?rkey=#{click_key}&utm_source=share&utm_medium=facebook&utm_campaign=#{params[:key]}")
  end

  private

  def experiment_params
    raw_params = params.require(:experiment).permit(:id, :name, :url, variants: [:id, :title, :description, :image_url, :_destroy, template_image: [:id, :url, { overlays: [:text, :top, :left, :size, :color, :font, :textStrokeWidth, :textStrokeColor, :align] } ] ])
    raw_params[:variants_attributes] = raw_params[:variants] if raw_params[:variants].present?

    raw_params[:variants_attributes] = raw_params[:variants_attributes].to_unsafe_hash.map do |k, v|
      v[:template_image_attributes] = v[:template_image]
      v.delete(:template_image)
      v
    end

    raw_params.delete(:variants)
    raw_params
  end

  def set_experiment
    @experiment = Experiment.find(params[:id]) if params[:id].present?
  end

  def check_for_key_param
    unless params[:key].present?
      redirect_to("https://#{@experiment.url}")
    end
  end

  def data_for_experiment
    data = @experiment.as_json(include: [ { variants: {include: :template_image} } ])
    data['variants'] = data['variants'].sort_by{ |o| o['id'] }.map do |v|
      if v['template_image']['overlays'].present?
        v['template_image']['overlays'] = v['template_image']['overlays'].map do |k, overlay|
          overlay['size'] = overlay['size'].to_i
          overlay['top'] = overlay['top'].to_i
          overlay['left'] = overlay['left'].to_i
          overlay['textStrokeWidth'] = overlay['textStrokeWidth'].to_i
          overlay
        end
      end
      v
    end

    { experiment: data , unsavedChanges: false }
  end
end
