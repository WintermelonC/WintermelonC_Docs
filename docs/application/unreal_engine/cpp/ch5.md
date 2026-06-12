# 5 打印调试信息

## 038 Actor Creation

创建 C++ 文件 `Items/Item.cpp`

## 039 Blueprint Creation

基于 Item C++ 创建蓝图 BP_Item

```cpp linenums="1"
void AItem::BeginPlay()
{
	Super::BeginPlay();
	
	UE_LOG(LogTemp, Warning, TEXT("BeginPlay called!"));
}
```

## 040 Onscreen Debug Messages

```cpp linenums="1"
void AItem::BeginPlay()
{
	if (GEngine)
	{
		GEngine->AddOnScreenDebugMessage(1, 60.f, FColor::Cyan, FString("Item OnScreen Message!"));
	}
}
```

## 041 Formatting Strings

```cpp linenums="1"
void AItem::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	
	UE_LOG(LogTemp, Warning, TEXT("DeltaTime: %f"), DeltaTime);
}
```

```cpp linenums="1"
void AItem::Tick(float DeltaTime)
{
	if (GEngine)
	{
		FString Message = FString::Printf(TEXT("DeltaTime: %f"), DeltaTime);
		GEngine->AddOnScreenDebugMessage(1, 60.f, FColor::Cyan, Message);
	}
}
```

FString 重载了 * 运算符，使用 * 会转变为 C 风格字符串

```cpp linenums="1"
void AItem::Tick(float DeltaTime)
{
	if (GEngine)
	{
		FString Name = GetName();
		FString Message = FString::Printf(TEXT("Item Name: %s"), *Name);
		GEngine->AddOnScreenDebugMessage(1, 60.f, FColor::Cyan, Message);
		
		UE_LOG(LogTemp, Warning, TEXT("Item Name: %s"), *Name);
	}
}
```

## 042 Drawing Debug Spheres

```cpp linenums="1"
void AItem::BeginPlay()
{
	UWorld* World = GetWorld();
	
	if (World)
	{
		FVector Location = GetActorLocation();
		DrawDebugSphere(World, Location, 25.f, 24, FColor::Red, false, 30.f);
	}
}
```

---

```cpp linenums="1" linenums="Slash.h"
#define DRAW_SPHERE(Location) if (GetWorld()) DrawDebugSphere(GetWorld(), Location, 25.f, 12, FColor::Red, true);
```

```cpp linenums="1" linenums="Item.cpp"
#include "Slash/Slash.h"

void AItem::BeginPlay()
{
	FVector Location = GetActorLocation();
	DRAW_SPHERE(Location);
}
```

## 043 Drawing Debug Lines

```cpp linenums="1" linenums="Slash.h"
#define DRAW_LINE(StartLocation, EndLocation) if (GetWorld()) DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1.f, 0, 1.f);
```

```cpp linenums="1" linenums="Item.cpp"
void AItem::BeginPlay()
{
	Super::BeginPlay();
	
	UWorld* World = GetWorld();
	FVector Location = GetActorLocation();
	FVector Forward = GetActorForwardVector();
	
	DRAW_SPHERE(Location);
	DRAW_LINE(Location, Location + Forward * 100.f);
}
```

## 044 Drawing Debug Points

```cpp linenums="1" linenums="Slash.h"
#define DRAW_VECTOR(StartLocation, EndLocation) if (GetWorld()) \
	{ \
		DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1.f, 0, 1.f); \
		DrawDebugPoint(GetWorld(), EndLocation, 15.f, FColor::Red, true); \
    }
```

```cpp linenums="1" linenums="Item.cpp"
void AItem::BeginPlay()
{
	Super::BeginPlay();
	
	UWorld* World = GetWorld();
	FVector Location = GetActorLocation();
	FVector Forward = GetActorForwardVector();
	
	DRAW_SPHERE(Location);
	DRAW_VECTOR(Location, Location + Forward * 100.f);
}
```

## 045 Custom Header Files

```cpp linenums="1" linenums="DebugMacros.h"
#pragma once

#include "DrawDebugHelpers.h"

#define DRAW_SPHERE(Location) if (GetWorld()) DrawDebugSphere(GetWorld(), Location, 25.f, 12, FColor::Red, true);
#define DRAW_LINE(StartLocation, EndLocation) if (GetWorld()) DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1.f, 0, 1.f);
#define DRAW_POINT(Location) if (GetWorld()) DrawDebugPoint(GetWorld(), Location, 15.f, FColor::Red, true);
#define DRAW_VECTOR(StartLocation, EndLocation) if (GetWorld()) \
{ \
DrawDebugLine(GetWorld(), StartLocation, EndLocation, FColor::Red, true, -1.f, 0, 1.f); \
DrawDebugPoint(GetWorld(), EndLocation, 15.f, FColor::Red, true); \
}
```

```cpp linenums="1" linenums="Item.cpp"
#include "Slash/DebugMacros.h"
```