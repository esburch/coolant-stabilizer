extends Node

var packed_scene = [
	preload("res://ui.tscn"),
	preload("res://dalle.tscn")
]

# Called when the node enters the scene tree for the first time.
func _ready():
	randomize()
	var x = randi() % packed_scene.size()
	
	var scene = packed_scene[x].instance()
	add_child(scene)

