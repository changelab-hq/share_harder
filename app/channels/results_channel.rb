class ResultsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "results:#{params[:experiment_id]}"
  end

  def update_results
    ActionCable.server.broadcast('results:1', {testing: true})
  end

  periodically :update_results, every: 5.seconds
end