class RacesController < ApplicationController
  def index
    @races = Race.all
    @game = Game.new
  end

  def coordinates
    @race = Race.find(params[:id])
    render json: @race.coordinates
  end
end
