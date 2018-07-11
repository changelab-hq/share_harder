class ResultsChannel < ApplicationCable::Channel
  def subscribed
    @experiment = Experiment.find(params[:experiment_id])
    stream_from "results:#{params[:experiment_id]}"
  end

  def update_results
    transmit({experiment: @experiment.results})
  end

  periodically :update_results, every: 2.seconds
end