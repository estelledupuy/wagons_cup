class RacesController < ApplicationController
  def index
  end

  def coordinates
    @race = Race.find(params[:id])
    render json: @race.coordinates
  end
end
