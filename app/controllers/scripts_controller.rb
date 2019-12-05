class ScriptsController < ApplicationController
  protect_from_forgery except: :script

  def script
    render js: Uglifier.new(harmony: true).compile(render_to_string)
  end
end
