# 8 Character

## 070 The Character Class

基于 Character 创建 C++ 文件 `Characters/SlashCharacter.cpp`

## 071 Character Inputs

## 072 Character Camera and Spring Arm

## 073 The Rotation Matrix

## 074 Controller Directions

```cpp linenums="1" title="SlashCharacter.h"
class SLASH_API ASlashCharacter : public ACharacter
{
protected:
	UPROPERTY(EditDefaultsOnly, Category = "CInput")
	TObjectPtr<UInputMappingContext> InputMappingContext;
	UPROPERTY(EditDefaultsOnly, Category = "CInput")
	TObjectPtr<UInputAction> MoveAction;
	UPROPERTY(EditDefaultsOnly, Category = "CInput")
	TObjectPtr<UInputAction> LookAction;
	
	void Move(const FInputActionValue& Value);
	void Look(const FInputActionValue& Value);
	
private:
	UPROPERTY(VisibleAnywhere)
	TObjectPtr<USpringArmComponent> CameraBoom;
	UPROPERTY(VisibleAnywhere)
	TObjectPtr<UCameraComponent> ViewCamera;
};
```

```cpp linenums="1" title="SlashCharacter.cpp"
ASlashCharacter::ASlashCharacter()
{
	PrimaryActorTick.bCanEverTick = true;
	
	bUseControllerRotationPitch = false;
	bUseControllerRotationRoll = false;
	bUseControllerRotationYaw = false;
	
	GetCharacterMovement()->bOrientRotationToMovement = true;
	GetCharacterMovement()->RotationRate = FRotator(0.f, 400.f, 0.f);
	
	CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
	CameraBoom->SetupAttachment(GetRootComponent());
	CameraBoom->TargetArmLength = 300.f;
	
	ViewCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("ViewCamera"));
	ViewCamera->SetupAttachment(CameraBoom);
}

void ASlashCharacter::Move(const FInputActionValue& Value)
{
	const FVector2D MovementValue = Value.Get<FVector2D>();
	
	if (Controller)
	{
		const FRotator ControlRotation = GetControlRotation();
		const FRotator YawRotation(0.f, ControlRotation.Yaw, 0.f);
		const FVector Forward = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
		const FVector Right = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);
		AddMovementInput(Forward, MovementValue.X);
		AddMovementInput(Right, MovementValue.Y);
	}
}
```

## 075 Hair and Eyebrows

```cpp linenums="1" title="SlashCharacter.h"
class SLASH_API ASlashCharacter : public ACharacter
{
private:
	UPROPERTY(VisibleAnywhere, Category = "CHair")
	TObjectPtr<UGroomComponent> Hair;
	UPROPERTY(VisibleAnywhere, Category = "CHair")
	TObjectPtr<UGroomComponent> Eyebrows;
};
```

```cpp linenums="1" title="SlashCharacter.cpp"
ASlashCharacter::ASlashCharacter()
{
	Hair = CreateDefaultSubobject<UGroomComponent>(TEXT("Hair"));
	Hair->SetupAttachment(GetMesh());
	Hair->AttachmentName = FString("head");
	
	Eyebrows = CreateDefaultSubobject<UGroomComponent>(TEXT("Eyebrows"));
	Eyebrows->SetupAttachment(GetMesh());
	Eyebrows->AttachmentName = FString("head");
}
```

## 076 Custom Hair Color
