class BoatChannel < ApplicationCable::Channel
  def subscribed
    boat = Boat.find(params[:id])
    stream_for boat
  end
end
