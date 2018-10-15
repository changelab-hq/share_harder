class TemplateImagesController < ApplicationController
  before_action :authenticate_admin, except: :image
  before_action :set_template_image

  def index
    @template_images = TemplateImage.where(variant: nil)
  end

  def new
    @template_image = TemplateImage.new
  end

  def create
    template_image = TemplateImage.create!(template_image_params.merge(url: 'http://via.placeholder.com/540x540'))
    redirect_to edit_template_image_path(template_image)
  end

  def show

  end

  def edit
    @template_image_props = data_for_template_image
  end

  def update
    @template_image.update_attributes(template_image_params.to_h)
    render json: data_for_template_image
  end

  def image
    respond_to do |format|
      format.jpg do
        send_data(@template_image.render_to_jpg(params).to_blob, :type => "image/jpg", :disposition => 'inline')
      end
    end
  end

  private

  def template_image_params
    params.require(:template_image).permit(:name, :url, :width, :height, overlays: [:text, :top, :left, :size, :color, :font, :textStrokeWidth, :textStrokeColor, :align, :rotation])
  end

  def set_template_image
    @template_image = TemplateImage.find(params[:id]) if params[:id].present?
  end

  def data_for_template_image
    data = @template_image.as_json
    data['overlays'] = data['overlays'].map do |k, overlay|
      overlay['size'] = overlay['size'].to_i
      overlay['top'] = overlay['top'].to_i
      overlay['left'] = overlay['left'].to_i
      overlay['rotation'] = overlay['rotation'].to_i
      overlay['textStrokeWidth'] = overlay['textStrokeWidth'].to_i
      overlay
    end

    { template_image: data , unsavedChanges: false }
  end

end
