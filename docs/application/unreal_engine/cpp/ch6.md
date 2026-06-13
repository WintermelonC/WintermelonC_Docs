# 6 Actor

## 047 SetActorLocation

蓝图中的 BeginPlay 先于 C++ 代码中的 BeginPlay 执行

```cpp linenums="1" title="Item.cpp"
void AItem::BeginPlay()
{
	Super::BeginPlay();
	
	UWorld* World = GetWorld();
	
	SetActorLocation(FVector(0.f, 0.f, 50.f));
	FVector Location = GetActorLocation();
	FVector Forward = GetActorForwardVector();
	
	DRAW_SPHERE(Location);
	DRAW_VECTOR(Location, Location + Forward * 100.f);
}
```

## 048 SetActorRotation

```cpp linenums="1" title="Item.cpp"
void AItem::BeginPlay()
{
	Super::BeginPlay();
	
	UWorld* World = GetWorld();
	
	SetActorLocation(FVector(0.f, 0.f, 50.f));
	SetActorRotation(FRotator(0.f, 45.f, 0.f));
	FVector Location = GetActorLocation();
	FVector Forward = GetActorForwardVector();
	
	DRAW_SPHERE(Location);
	DRAW_VECTOR(Location, Location + Forward * 100.f);
}
```

## 049 Actor World Offset

```cpp linenums="1" title="Item.cpp"
void AItem::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	float MovementRate = 50.f;
	float RotationRate = 45.f;
	
	AddActorWorldOffset(FVector(MovementRate * DeltaTime, 0.f, 0.f));
	AddActorWorldRotation(FRotator(0.f, RotationRate * DeltaTime, 0.f));
	DRAW_SPHERE_SINGLE_FRAME(GetActorLocation());
	DRAW_VECTOR_SINGLE_FRAME(GetActorLocation(), GetActorLocation() + GetActorForwardVector() * 100.f);
}
```

## 051 The Sine Function

```cpp linenums="1" title="Item.h"
class SLASH_API AItem : public AActor
{
private:
	float RunningTime;
	float Amplitude = 0.25f;
	float TimeConstant = 5.f;
};
```

```cpp linenums="1" title="Item.cpp"
void AItem::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	RunningTime += DeltaTime;
	
	float DeltaZ = Amplitude * FMath::Sin(RunningTime * TimeConstant);
	
	AddActorWorldOffset(FVector(0.f, 0.f, DeltaZ));
	
	DRAW_SPHERE_SINGLE_FRAME(GetActorLocation());
	DRAW_VECTOR_SINGLE_FRAME(GetActorLocation(), GetActorLocation() + GetActorForwardVector() * 100.f);
}
```

## 052 Exposing Variables to Blueprint

1. EditDefaultsOnly：只能在蓝图的细节面板中编辑
2. EditInstanceOnly：只能在蓝图实例中编辑
3. EditAnywhere：在蓝图和蓝图实例中都能编辑

## 053 Visible, But Not Editable

1. VisibleDefaultsOnly：只能在蓝图的细节面板中查看
2. VisibleInstanceOnly：只能在蓝图实例中查看
3. VisibleAnywhere：在蓝图和蓝图实例中都能查看

## 054 Exposing Variables to the Event Graph

1. BlueprintReadOnly：可以在事件图表中 get
2. BlueprintReadWrite：可以在事件图表中 get 和 set

当变量为 private 时，`meta = (AllowPrivateAccess = "true")` 可以让事件图表获得操作该变量的权限

## 055 Exposing Functions

1. BlueprintCallable：可以在事件图表中调用
2. BlueprintPure：事件图表中调用此函数的节点不会有输入引脚

```cpp linenums="1" title="Item.h"
class SLASH_API AItem : public AActor
{
protected:
	virtual void BeginPlay() override;
	
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Sine Parameters")
	float Amplitude = 0.25f;
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Sine Parameters")
	float TimeConstant = 5.f;

	UFUNCTION(BlueprintPure)
	float TransformedSin();
	UFUNCTION(BlueprintPure)
	float TransformedCos();
private:
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, meta = (AllowPrivateAccess = "true"))
	float RunningTime;
};
```

```cpp linenums="1" title="Item.cpp"
float AItem::TransformedSin()
{
	return Amplitude * FMath::Sin(RunningTime * TimeConstant);
}

float AItem::TransformedCos()
{
	return Amplitude * FMath::Cos(RunningTime * TimeConstant);
}
```

## 056 Template Functions

## 057 Components

## 058 Components in C++

```cpp linenums="1" title="Item.h"
class SLASH_API AItem : public AActor
{
private:
	UPROPERTY(VisibleAnywhere)
	UStaticMeshComponent* ItemMesh;
}
```

```cpp linenums="1" title="Item.cpp"
AItem::AItem()
{
	PrimaryActorTick.bCanEverTick = true;
	
	ItemMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("ItemMeshComponent"));
	SetRootComponent(ItemMesh);
}
```