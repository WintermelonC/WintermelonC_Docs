# 3 控制输入

## 1 创建 Input Mapping Context 和 Input Action

输入映射上下文（Input Mapping Context）是一个定义了哪些输入键触发哪些输入动作的规则集合。它们通常与特定的游戏状态相关联，比如游戏中的主菜单、游戏中的行走状态等。可以通过编辑项目设置或蓝图脚本来创建和管理输入映射上下文

Input Action 代表了玩家可以执行的某种动作，比如跳跃、射击、打开菜单等。输入动作通常与键盘按键、鼠标按钮或游戏手柄按钮相关联。可以通过编辑输入映射来创建和管理输入动作，然后可以在蓝图或代码中监听这些输入动作，以便在玩家执行相应操作时触发相应的逻辑

## 2 获取 EnhancedInputComponent 获取输入

1. 更灵活的输入处理：相比于传统的输入组件，EnhancedInputComponent 允许更加灵活地定义输入操作和处理逻辑。它支持更多种类的输入设备和输入方式，并提供了更多的定制选项
2. 输入绑定的优化：EnhancedInputComponent 支持将输入绑定到函数、委托或蓝图中的事件，使输入处理变得更加直观和易于管理
3. 输入处理流程的改进：EnhancedInputComponent 提供了更多的控制权，使开发者可以更精确地管理输入事件的触发和处理顺序，从而优化输入响应的流畅度和准确性

```cpp linenums="1" title="PlayerCharacter.h"
class LEARNING_API APlayerCharacter : public ACharacter {
protected:
    void Move(const FInputActionValue& Value);
	void Look(const FInputActionValue& Value);

private:
    UPROPERTY(EditDefaultsOnly, Category = "MyInput")
	TObjectPtr<UInputMappingContext> DefaultMapping;

	UPROPERTY(EditDefaultsOnly, Category = "MyInput")
	TObjectPtr<UInputAction> MoveAction;

	UPROPERTY(EditDefaultsOnly, Category = "MyInput")
	TObjectPtr<UInputAction> LookAction;
}
```

```cpp linenums="1" title="PlayerCharacter.cpp"
void APlayerCharacter::BeginPlay()
{
	Super::BeginPlay();

	const ULocalPlayer* Player = nullptr;
	if (GEngine && GetWorld()) {
		Player = GEngine->GetFirstGamePlayer(GetWorld());
	}
	UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(Player);
	if (DefaultMapping) {
		Subsystem->AddMappingContext(DefaultMapping, 0);
	}
}

void APlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
	if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent)) {
		EnhancedInputComponent->BindAction(LookAction, ETriggerEvent::Triggered, this, &APlayerCharacter::Look);
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &APlayerCharacter::Move);
	}
}

void APlayerCharacter::Move(const FInputActionValue& Value)
{
	FVector2D MoveVector = Value.Get<FVector2D>();
	if (Controller) {
		const FRotator Rotation = Controller->GetControlRotation();
		const FRotator YawRotation(0, Rotation.Yaw, 0);
		const FVector ForwardDirection = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
		const FVector RightDirection = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);
		AddMovementInput(ForwardDirection, MoveVector.X);
		AddMovementInput(RightDirection, MoveVector.Y);
	}
}

void APlayerCharacter::Look(const FInputActionValue& Value)
{
	FVector2D LookVector = Value.Get<FVector2D>();
	if (Controller) {
		AddControllerYawInput(LookVector.X);
		AddControllerPitchInput(LookVector.Y);
	}
}
```

## 3 调整角色运动转向

```cpp linenums="1" title="PlayerCharacter.cpp"
APlayerCharacter::APlayerCharacter()
{
	// 角色不跟随控制器旋转
	bUseControllerRotationYaw = false;
	bUseControllerRotationPitch = false;
	bUseControllerRotationRoll = false;

	// 相机杆跟随控制器旋转，摄像机不跟随控制器旋转
	CameraBoom->bUsePawnControlRotation = true;
	PlayerCamera->bUsePawnControlRotation = false;

	// 角色朝向移动方向旋转
	GetCharacterMovement()->bOrientRotationToMovement = true;
	GetCharacterMovement()->RotationRate = FRotator(0.f, 400.f, 0.f);
}
```