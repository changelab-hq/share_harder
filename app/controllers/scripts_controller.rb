class ScriptsController < ApplicationController
  protect_from_forgery except: :script

  def script
    $embed_script_js ||= Uglifier.new(harmony: true).compile(render_to_string)
    render js: $embed_script_js
  end
end
