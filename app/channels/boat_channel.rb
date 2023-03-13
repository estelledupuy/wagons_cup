class BoatChannel < ApplicationCable::Channel
  def subscribed
    boat = Boat.find(params[:id])
    stream_for boat
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
