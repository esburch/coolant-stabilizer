extends Node2D

# Declare member variables here. Examples:
# var a = 2
# var b = "text"
onready var timer = get_node("Coolant/Timer")
onready var pb = get_node("TextureProgress")

# Called when the node enters the scene tree for the first time.
func _ready():
	pb.value=0
	randomize()
	$BobberPath/BobberFollowPath.set_offset(randi())
	print($BobberPath/BobberFollowPath.position)
	# Create a bobber instance and add it to the scene.
	var bobber = preload("res://Bobber.tscn").instance()
	add_child(bobber)
	bobber.position = $BobberPath/BobberFollowPath.position
		

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	#print(timer.time_left)
	# Keeps bar clear at load
	if timer.time_left == 0:
		pb.value = 0
	else:
		pb.value = 2-timer.time_left


func _on_Button_pressed():
	$TutorialOverlay.visible = false

