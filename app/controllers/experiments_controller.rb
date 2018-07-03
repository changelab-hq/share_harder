class ExperimentsController < ApplicationController
  before_action :authenticate, except: [:metatags, :redirect, :lookup]

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
    @experiment_props = { experiment: @experiment.as_json(include: :variants) }
  end

  def demo
    @experiment = Experiment.find(params[:id])
  end

  def metatags
    @share = Experiment.fetch(params[:id]).get_share_by_key(params[:key], params[:v], params[:r])
    @metatags = @share.variant.render_metatags(params)
    render layout: false
  end

  def redirect
    @experiment = Experiment.fetch(params[:id])
    AddClickWorker.perform_async(params[:key])
    redirect_to(@experiment.url)
  end

  private

  def experiment_params
    raw_params = params.require(:experiment).permit(:id, :name, :url, variants: [:id, :title, :description, :image_url, :_destroy])
    raw_params[:variants_attributes] = raw_params[:variants] if raw_params[:variants].present?
    raw_params.delete(:variants)
    raw_params
  end
end
