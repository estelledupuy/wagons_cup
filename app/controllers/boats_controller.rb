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
    @boat.latitude = Race.find(params[:race_id]).starting_latitude
    @boat.longitude = Race.find(params[:race_id]).starting_longitude

    if @boat.save!
      redirect_to game_path @game, params: { boat_id: @boat.id }
    else
      render :new, status: :unprocessable_entity
    end
  end

  # def edit
  #   @boat = Boat.find(params:id)
  # end

  def update
    @boat = Boat.find(params[:id])
    @direction = params[:boat][:direction]

    @boat.latitude = ComputeNewPosition.new(@boat, @direction).call[0] #Get param from user decision
    @boat.longitude = ComputeNewPosition.new(@boat, @direction).call[1]
    @boat.direction = @direction
    @boat.save!
  end

  # latitude: 48.649518, longitude: -2.0260409 // 48.649518

  private

  def boat_params
    params.require(:boat).permit(:name, :navy, :leafy, :poppy)
  end

end
