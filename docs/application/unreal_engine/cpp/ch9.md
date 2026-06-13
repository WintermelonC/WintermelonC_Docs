# 9 Animation

## 078 The Animation Blueprint

基于 Echo_Skeleton 创建动画蓝图 ABP_Echo

<figure markdown="span">
  ![Img 1](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img1.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 2](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img2.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 3](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img3.png){ width="600" }
</figure>

=== "Idle"

    <figure markdown="span">
      ![Img 4](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img4.png){ width="600" }
    </figure>

=== "Run"

    <figure markdown="span">
      ![Img 5](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img5.png){ width="600" }
    </figure>

=== "Idle to Run"

    <figure markdown="span">
      ![Img 6](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img6.png){ width="600" }
    </figure>

=== "Run to Idle"

    <figure markdown="span">
      ![Img 7](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img7.png){ width="600" }
    </figure>

## 079 The Anim Instance

基于 AnimInstance 创建一个 C++ 文件 `SlashAnimInstance`

```cpp linenums="1" title="SlashAnimInstance.h"
class SLASH_API USlashAnimInstance : public UAnimInstance
{
	GENERATED_BODY()
	
public:
	virtual void NativeInitializeAnimation() override;
	virtual void NativeUpdateAnimation(float DeltaTime) override;
	
	UPROPERTY(BlueprintReadOnly)
	TObjectPtr<ASlashCharacter> SlashCharacter;
	UPROPERTY(BlueprintReadOnly, Category = "CMovement")
	TObjectPtr<UCharacterMovementComponent> SlashCharacterMovement;
	UPROPERTY(BlueprintReadOnly, Category = "CMovement")
	float GroundSpeed;
};
```

```cpp linenums="1" title="SlashAnimInstance.cpp"
void USlashAnimInstance::NativeInitializeAnimation()
{
	Super::NativeInitializeAnimation();
	
	SlashCharacter = Cast<ASlashCharacter>(TryGetPawnOwner());
	if (SlashCharacter)
	{
		SlashCharacterMovement = SlashCharacter->GetCharacterMovement();
	}
}

void USlashAnimInstance::NativeUpdateAnimation(float DeltaTime)
{
	Super::NativeUpdateAnimation(DeltaTime);
	
	if (SlashCharacterMovement)
	{
		GroundSpeed = UKismetMathLibrary::VSizeXY(SlashCharacterMovement->Velocity);
	}
}
```

## 090 Jumping

```cpp linenums="1" title="SlashCharacter.h"
class SLASH_API ASlashCharacter : public ACharacter
{
protected:
	UPROPERTY(EditDefaultsOnly, Category = "CInput")
	TObjectPtr<UInputAction> JumpAction;
	
	void Jump(const FInputActionValue& Value);
};
```

```cpp linenums="1" title="SlashCharacter.cpp"
void ASlashCharacter::Jump(const FInputActionValue& Value)
{
	ACharacter::Jump();
}

void ASlashCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
	
	if (UEnhancedInputComponent* EnhancedInputComponent= CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
	{
		EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Triggered, this, &ASlashCharacter::Jump);
	}
}
```

## 091 Jump Animations

```cpp linenums="1" title="SlashAnimInstance.h"
class SLASH_API USlashAnimInstance : public UAnimInstance
{
public:
	UPROPERTY(BlueprintReadOnly, Category = "CMovement")
	bool bIsFalling;
};
```

```cpp linenums="1" title="SlashAnimInstance.cpp"
void USlashAnimInstance::NativeUpdateAnimation(float DeltaTime)
{
	Super::NativeUpdateAnimation(DeltaTime);
	
	if (SlashCharacterMovement)
	{
		GroundSpeed = UKismetMathLibrary::VSizeXY(SlashCharacterMovement->Velocity);
		bIsFalling = SlashCharacterMovement->IsFalling();
	}
}
```

<figure markdown="span">
  ![Img 8](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img8.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 9](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img9.png){ width="600" }
</figure>

=== "OnGround"

    <figure markdown="span">
      ![Img 10](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img10.png){ width="600" }
    </figure>

=== "InAir"

    <figure markdown="span">
      ![Img 11](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img11.png){ width="600" }
    </figure>

=== "Land"

    <figure markdown="span">
      ![Img 12](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img12.png){ width="600" }
    </figure>

=== "OnGround to InAir"

    <figure markdown="span">
      ![Img 13](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img13.png){ width="600" }
    </figure>

=== "InAir to Land"

    <figure markdown="span">
      ![Img 14](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img14.png){ width="600" }
    </figure>

=== "Land to OnGround"

    其中一个勾选基于状态中序列播放器的自动规则

    另外一个

    <figure markdown="span">
      ![Img 15](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img15.png){ width="600" }
    </figure>

## 082 Inverse Kinematics

基于 ControlRig 创建控制绑定文件

创建函数 FootTrace

<figure markdown="span">
  ![Img 16](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img16.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 17](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img17.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 18](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img18.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 19](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img19.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 20](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img20.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 21](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img21.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 22](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img22.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 23](../../../img/unreal_engine/cpp/ch9/ue_cpp_ch9_img23.png){ width="600" }
</figure>
