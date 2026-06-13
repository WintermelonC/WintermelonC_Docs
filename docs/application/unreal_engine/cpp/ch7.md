# 7 Pawn

## 060 The Pawn Class

基于 Pawn 创建 C++ 文件 `Pawns/Bird.cpp`

基于此文件创建蓝图 `BP_Bird`

## 061 Capsule Component

```cpp linenums="1" title="Bird.h"
class SLASH_API ABird : public APawn
{
private:
	UPROPERTY(VisibleAnywhere)
	UCapsuleComponent* Capsule;
};
```

```cpp linenums="1" title="Bird.cpp"
ABird::ABird()
{
	PrimaryActorTick.bCanEverTick = true;
	
	Capsule = CreateDefaultSubobject<UCapsuleComponent>(TEXT("Capsule"));
	Capsule->SetCapsuleHalfHeight(20.f);
	Capsule->SetCapsuleRadius(15.f);
	SetRootComponent(Capsule);
}
```

## 062 Forward Declaration

```cpp linenums="1" title="Bird.h"
class UCapsuleComponent;
```

```cpp linenums="1" title="Bird.cpp"
#include "Components/CapsuleComponent.h"
```

## 063 Skeletal Mesh Components

```cpp linenums="1" title="Bird.h"
class SLASH_API ABird : public APawn
{
private:
	UPROPERTY(VisibleAnywhere)
	USkeletalMeshComponent* BirdMesh;
};
```

```cpp linenums="1" title="Bird.cpp"
ABird::ABird()
{
	BirdMesh = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("BirdMesh"));
	BirdMesh->SetupAttachment(GetRootComponent());
}
```

## 064 Binding Inputs

添加 BP_Bird 到场景当中，将自动控制玩家设置为 Player 0，开始游戏后，我们的视角就附着在鸟的身上了

```cpp linenums="1" title="Bird.cpp"
ABird::ABird()
{
	AutoPossessPlayer = EAutoReceiveInput::Player0;
}
```

## 065 Adding Movement Input

```cpp linenums="1" title="Bird.h"
class SLASH_API ABird : public APawn
{
protected:
	UPROPERTY(EditDefaultsOnly, Category = "CInput")
	TObjectPtr<UInputMappingContext> InputMappingContext;
	UPROPERTY(EditDefaultsOnly, Category = "CInput")
	TObjectPtr<UInputAction> MoveAction;
	
	void Move(const FInputActionValue& Value);
}
```

```cpp linenums="1" title="Bird.cpp"
void ABird::BeginPlay()
{
	Super::BeginPlay();
	
	if (const APlayerController* PlayerController = Cast<APlayerController>(Controller))
	{
		if (UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PlayerController->GetLocalPlayer()))
		{
			Subsystem->AddMappingContext(InputMappingContext, 0);
		}
	}
}

void ABird::Move(const FInputActionValue& Value)
{
	const FVector2D MovementValue = Value.Get<FVector2D>();
	
	if (Controller)
	{
		const FVector Forward = GetActorForwardVector();
		AddMovementInput(Forward, MovementValue.X);
		const FVector Right = GetActorRightVector();
		AddMovementInput(Right, MovementValue.Y);
	}
}

void ABird::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
	
	if (UEnhancedInputComponent* EnhancedInputComponent= CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &ABird::Move);
	}
}
```

由于 Pawn 默认没有移动组件，在 BP_Bird 中添加一个 FloatingPawnMovement 组件

## 066 Camera and Spring Arm

```cpp linenums="1" title="Bird.h"
class SLASH_API ABird : public APawn
{
protected:
	UPROPERTY(VisibleAnywhere)
	TObjectPtr<USpringArmComponent> CameraBoom;
	UPROPERTY(VisibleAnywhere)
	TObjectPtr<UCameraComponent> ViewCamera;
}
```

```cpp linenums="1" title="Bird.cpp"
ABird::ABird()
{
	CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
	CameraBoom->SetupAttachment(GetRootComponent());
	CameraBoom->TargetArmLength = 300.f;
	
	ViewCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("ViewCamera"));
	ViewCamera->SetupAttachment(CameraBoom);
}
```

## 067 Adding Controller Input

```cpp linenums="1" title="Bird.h"
class SLASH_API ABird : public APawn
{
protected:
	UPROPERTY(EditDefaultsOnly, Category = "CInput")
	TObjectPtr<UInputAction> LookAction;
	
	void Look(const FInputActionValue& Value);
}
```

```cpp linenums="1" title="Bird.cpp"
void ABird::Look(const FInputActionValue& Value)
{
	const FVector2D LookValue = Value.Get<FVector2D>();
	
	if (Controller)
	{
		AddControllerYawInput(LookValue.X);
		AddControllerPitchInput(LookValue.Y);
	}
}

void ABird::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
	
	if (UEnhancedInputComponent* EnhancedInputComponent= CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &ABird::Move);
		EnhancedInputComponent->BindAction(LookAction, ETriggerEvent::Triggered, this, &ABird::Look);
	}
}
```

## 068 Setting the Default Pawn

1. 基于 GameModeBase 新建蓝图类 BP_BirdGameMode，将默认 Pawn 类改为 BP_Bird
2. 设置关卡的游戏模式重载为 BP_BirdGameMode
3. 打开放置 Actor 面板，拖入一个玩家出生点、
