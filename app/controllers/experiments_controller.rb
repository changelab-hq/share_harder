class ExperimentsController < ApplicationController
  before_action :authenticate_admin, except: %i[metatags redirect lookup preview_image share]
  before_action :set_experiment
  before_action :check_for_key_param, only: %i[metatags redirect]

  def index
    @experiments = Experiment.where(archived_at: nil).order("updated_at DESC").paginate(page: params[:page])
    @sidebar_content = 'test'
  end

  def archived_index
    @experiments = Experiment.where.not(archived_at: nil).order("updated_at DESC").paginate(page: params[:page])
  end

  def new
    @experiment = Experiment.new
  end

  def create
    experiment = Experiment.create!(experiment_params)
    redirect_to edit_experiment_path(experiment)
  end

  def clone
    new_experiment = @experiment.deep_clone(include: :variants)
    new_experiment.name += ' (clone)'
    new_experiment.save!
    new_experiment.update_attributes url: experiment_demo_url(new_experiment)
    redirect_to edit_experiment_path(new_experiment)
  end

  def archive
    if @experiment.archived?
      @experiment.update_attributes(archived_at: @experiment.archived? ? nil : Time.now)
      flash[:notice] = 'Experiment restored'
    else
      @experiment.update_attributes(archived_at: Time.now)
      flash[:notice] = 'Experiment archived'
    end

    redirect_to experiments_path
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
    key = if params[:test].present?
            'test'
          else
            SecureRandom.hex(16)
          end

    url = e_url(@experiment, params: request.query_parameters.merge({ key: key }))
    redirect_to "https://www.facebook.com/sharer.php?u=#{CGI.escape(url)}"
  end

  def metatags
    @share = if params[:key] == 'test'
               Share.new(variant: @experiment.variants.sample)
             else
               @experiment.get_share_by_key(params[:key], params[:v], params[:r])
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
    raw_params = params.require(:experiment).permit(:id, :name, :url, variants: [:id, :title, :description, :_destroy, { template_image: [:id, :url, :height, :width, { overlays: %i[text top left size color font textStrokeWidth textStrokeColor align rotation] }] }])

    if raw_params[:variants].present?
      raw_params[:variants_attributes] = raw_params[:variants]

      raw_params[:variants_attributes] = raw_params[:variants_attributes].to_unsafe_hash.map do |_k, v|
        v[:template_image_attributes] = v[:template_image]
        v.delete(:template_image)
        v
      end

      raw_params.delete(:variants)
    end

    raw_params
  end

  def set_experiment
    @experiment = Experiment.find(params[:id]) if params[:id].present?
  end

  def check_for_key_param
    redirect_to("https://#{@experiment.url}") if params[:key].blank?
  end

  def data_for_experiment
    data = @experiment.as_json(include: [{ variants: { include: :template_image } }])
    data['variants'] = data['variants'].sort_by { |o| o['id'] }.map do |v|
      if v['template_image']['overlays'].present?
        v['template_image']['overlays'] = v['template_image']['overlays'].map do |_k, overlay|
          overlay['size'] = overlay['size'].to_i
          overlay['top'] = overlay['top'].to_i
          overlay['left'] = overlay['left'].to_i
          overlay['textStrokeWidth'] = overlay['textStrokeWidth'].to_i
          overlay
        end
      end
      v
    end

    { experiment: data, unsavedChanges: false }
  end
end
