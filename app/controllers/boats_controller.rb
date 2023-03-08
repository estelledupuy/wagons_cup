class BoatsController < ApplicationController
  def new
    @boat = Boat.new
    @race = Race.find(params[:race_id])
  end

  def create
    @game = Game.new
    @game.race_id = params[:race_id]
    @boat = Boat.new(boat_params)
    @boat.game = @game
    if @boat.save!
      redirect_to races_path
      # route to be changed !!!
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
  end

  private

  def boat_params
    params.require(:boat).permit(:name, :navy, :leafy, :poppy)
  end
end
