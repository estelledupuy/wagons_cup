class BoatsController < ApplicationController
  def new
    @boat = Boat.new
  end

  def create
    @boat = Boat.new(boat_params)
    @game = Game.new
    @boat.game = @game
    raise
    if @boat.save!
      redirect_to home_path
      # route to be changed
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
