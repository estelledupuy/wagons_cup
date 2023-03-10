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
    @boat.update(direction: params[:boat][:direction])
    ComputePositionJob.perform_later(params[:id])
    redirect_to game_path(@boat.game)
  end

  def select
    render json: { url: Boat.image_urls(params[:color]) }
  end

  private

  def boat_params
    params.require(:boat).permit(:name, :navy, :leafy, :poppy)
  end

end
