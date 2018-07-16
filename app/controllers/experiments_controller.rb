class ExperimentsController < ApplicationController
  before_action :authenticate_admin, except: [:metatags, :redirect, :lookup]

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
    @experiment = Experiment.find(params[:id])
    @experiment_props = { experiment: @experiment.as_json(include: :variants), unsavedChanges: false }
  end

  def update
    @experiment = Experiment.find(params[:id])
    @experiment.update_attributes(experiment_params.to_h)
    render json: @experiment.as_json(include: :variants, root: true)
  end

  def results 
    @experiment = Experiment.find(params[:id])
    @experiment_props = { experiment: @experiment.results }
  end

  def demo
    @experiment = Experiment.find(params[:id])
  end

  def metatags
    @experiment = Experiment.fetch(params[:id])
    check_for_key_param!
    
    @share = @experiment.get_share_by_key(params[:key], params[:v], params[:r])
    @metatags = @share.variant.render_metatags(params)
    render layout: false
  end

  def redirect
    @experiment = Experiment.fetch(params[:id])
    check_for_key_param!

    click_key = Click.generate_key
    AddClickWorker.perform_async(params[:key], click_key, request.user_agent, request.remote_ip)
    Rails.logger.info(request.user_agent)
    Rails.logger.info(request.headers)
    redirect_to("https://#{@experiment.url}?rkey=#{click_key}&utm_source=share&utm_medium=facebook&utm_campaign=#{params[:key]}")
  end

  private

  def experiment_params
    raw_params = params.require(:experiment).permit(:id, :name, :url, variants: [:id, :title, :description, :image_url, :_destroy])
    raw_params[:variants_attributes] = raw_params[:variants] if raw_params[:variants].present?
    raw_params.delete(:variants)
    raw_params
  end

  def check_for_key_param!
    redirect_to("https://#{@experiment.url}") unless params[:key].present?
  end
end
