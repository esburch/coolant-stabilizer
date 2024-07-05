extends Node2D

# Declare member variables here. Examples:
# var a = 2
# var b = "text"
onready var timer = get_node("Coolant/Timer")
onready var pb = get_node("TextureProgress")
# Called when the node enters the scene tree for the first time.
func _ready():
	pb.value=5
		

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	print(timer.time_left)
	pb.value = 5-timer.time_left
