class GamesController < ApplicationController
  def new
    @game = Game.new
  end

  def create
  end

  def show
    @boat = Boat.find(params[:boat_id])
  end
end
