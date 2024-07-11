extends KinematicBody2D

const VELOCITY: float = -18.0
var velocity = Vector2.ZERO

var gravity = ProjectSettings.get_setting("physics/2d/default_gravity") * 5

func _physics_process(delta):
	if not is_on_floor():
		velocity.y += gravity * delta

	if Input.is_action_pressed("Up"):
		velocity.y += VELOCITY

	var collision = move_and_collide(velocity * delta)
	if collision:
		velocity = velocity.bounce(collision.get_normal()) * 0.4

func _on_Area2D_area_entered(area: Area2D) -> void:
	print(area.name, " entered")
	$Timer.start()

func _on_Area2D_area_exited(area: Area2D) -> void:
	print(area.name, " exited")
	$Timer.stop()

func _on_Timer_timeout():
	print("Success")
	$Timer.stop()
	get_tree().change_scene("res://success.tscn")
	
	
