#pragma once

/*
 * NoiseSettings - Written by Jelle van der Gulik.
 * FastNoise https://github.com/Auburns/FastNoise library wrapper to expose variables to the Unreal Editor.
 * 
 * Add the NoiseSettings data type to any class publicly to view and edit the settings in the editor.
 * In usage:
 * Run the Apply() once, and use GetNoise(x, y) afterwards to get noise results.
 */

#include "Core.h"
#include "Lib/FastNoise.h"

#include "NoiseSettings.generated.h"

UENUM(BlueprintType)
enum ENoiseType
{
	VALUE,
	VALUEFRACTAL,
	PERLIN,
	PERLINFRACTAL,
	SIMPLEX,
	SIMPLEXFRACTAL,
	CELLULAR,
	WHITENOISE,
	CUBIC,
	CUBICFRACTAL
};

UENUM(BlueprintType)
enum ENoiseInterpolationType
{
	LINEAR,
	HERMITE,
	QUINTIC
};

UENUM(BlueprintType)
enum ENoiseFractalType
{
	FBM,
	BILLOW,
	RIGIDMULTI
};

UENUM(BlueprintType)
enum ENoiseCellularDistanceFunction
{
	EUCLIDEAN,
	MANHATTAN,
	NATURAL
};

UENUM(BlueprintType)
enum ENoiseCellularReturnType
{
	CELLVALUE,
	NOISELOOKUP,
	DISTANCE,
	DISTANCE2,
	DISTANCE2ADD,
	DISTANCE2SUB,
	DISTANCE2MUL,
	DISTANCE2DIV
};

USTRUCT(BlueprintType)
struct FNoiseSettings
{
	GENERATED_USTRUCT_BODY()
	
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	float positionScale = 1.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	float noiseScale = 1.0f;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	float noisePower = 1.0f;

	// Sets seed used for all noise types
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	int32 seed = 0;
	
	// Set noise type for noise generation
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	TEnumAsByte<ENoiseType> noiseType = ENoiseType::SIMPLEX;

	// Sets frequency for all noise types
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	float frequency = 0.01f;
	
	// Used in Value, Perlin Noise and Position Warping
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	TEnumAsByte<ENoiseInterpolationType> interpolation = ENoiseInterpolationType::QUINTIC;
	
	// Sets octave count for all fractal noise types
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	int32 fractalOctaves = 3;
	
	// Sets octave lacunarity for all fractal noise types
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	float fractalLacunarity = 2.0f;
	
	// Sets octave gain for all fractal noise types
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	float fractalGain = 0.5f;
	
	// Sets method for combining octaves in all fractal noise types
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	TEnumAsByte<ENoiseFractalType> fractalType = ENoiseFractalType::FBM;

	// Sets distance function used in cellular noise calculations
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	TEnumAsByte<ENoiseCellularDistanceFunction> cellularDistanceFunction = ENoiseCellularDistanceFunction::EUCLIDEAN;

	// Sets return type from cellular noise calculations
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	TEnumAsByte<ENoiseCellularReturnType> cellularReturnType = ENoiseCellularReturnType::CELLVALUE;

	// Sets the maximum distance a cellular point can move from its grid position
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	float cellularJitter = 0.45;

	// Sets the maximum warp distance from original location when using GradientPerturb{Fractal}(...)
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Settings")
	float gradientPerturbAmp = 1.0f;

	FastNoise noise;

	void Apply()
	{
		if (seed == 0) { seed = rand(); }
		noise.SetSeed(seed);
		switch (noiseType)
		{
			case ENoiseType::VALUE: noise.SetNoiseType(FastNoise::NoiseType::Value); break;
			case ENoiseType::VALUEFRACTAL: noise.SetNoiseType(FastNoise::NoiseType::ValueFractal); break;
			case ENoiseType::PERLIN: noise.SetNoiseType(FastNoise::NoiseType::Perlin); break;
			case ENoiseType::PERLINFRACTAL: noise.SetNoiseType(FastNoise::NoiseType::PerlinFractal); break;
			case ENoiseType::SIMPLEX: noise.SetNoiseType(FastNoise::NoiseType::Simplex); break;
			case ENoiseType::SIMPLEXFRACTAL : noise.SetNoiseType(FastNoise::NoiseType::SimplexFractal); break;
			case ENoiseType::CELLULAR: noise.SetNoiseType(FastNoise::NoiseType::Cellular); break;
			case ENoiseType::WHITENOISE: noise.SetNoiseType(FastNoise::NoiseType::WhiteNoise); break;
			case ENoiseType::CUBIC: noise.SetNoiseType(FastNoise::NoiseType::Cubic); break;
			case ENoiseType::CUBICFRACTAL: noise.SetNoiseType(FastNoise::NoiseType::CubicFractal); break;
		}
		noise.SetFrequency(frequency);
		switch (interpolation)
		{
			case ENoiseInterpolationType::LINEAR: noise.SetInterp(FastNoise::Interp::Linear); break;
			case ENoiseInterpolationType::HERMITE: noise.SetInterp(FastNoise::Interp::Hermite); break;
			case ENoiseInterpolationType::QUINTIC: noise.SetInterp(FastNoise::Interp::Quintic); break;
		}
		noise.SetFractalOctaves(fractalOctaves);
		noise.SetFractalLacunarity(fractalLacunarity);
		noise.SetFractalGain(fractalGain);
		switch (fractalType)
		{
			case ENoiseFractalType::FBM: noise.SetFractalType(FastNoise::FractalType::FBM); break;
			case ENoiseFractalType::BILLOW: noise.SetFractalType(FastNoise::FractalType::Billow); break;
			case ENoiseFractalType::RIGIDMULTI: noise.SetFractalType(FastNoise::FractalType::RigidMulti); break;
		}
		switch (cellularDistanceFunction)
		{
			case ENoiseCellularDistanceFunction::EUCLIDEAN: noise.SetCellularDistanceFunction(FastNoise::CellularDistanceFunction::Euclidean); break;
			case ENoiseCellularDistanceFunction::MANHATTAN: noise.SetCellularDistanceFunction(FastNoise::CellularDistanceFunction::Manhattan); break;
			case ENoiseCellularDistanceFunction::NATURAL: noise.SetCellularDistanceFunction(FastNoise::CellularDistanceFunction::Natural); break;
		}
		switch (cellularReturnType)
		{
			case ENoiseCellularReturnType::CELLVALUE: noise.SetCellularReturnType(FastNoise::CellularReturnType::CellValue); break;
			case ENoiseCellularReturnType::NOISELOOKUP: noise.SetCellularReturnType(FastNoise::CellularReturnType::NoiseLookup); break;
			case ENoiseCellularReturnType::DISTANCE: noise.SetCellularReturnType(FastNoise::CellularReturnType::Distance); break;
			case ENoiseCellularReturnType::DISTANCE2: noise.SetCellularReturnType(FastNoise::CellularReturnType::Distance2); break;
			case ENoiseCellularReturnType::DISTANCE2ADD: noise.SetCellularReturnType(FastNoise::CellularReturnType::Distance2Add); break;
			case ENoiseCellularReturnType::DISTANCE2SUB: noise.SetCellularReturnType(FastNoise::CellularReturnType::Distance2Sub); break;
			case ENoiseCellularReturnType::DISTANCE2MUL: noise.SetCellularReturnType(FastNoise::CellularReturnType::Distance2Mul); break;
			case ENoiseCellularReturnType::DISTANCE2DIV: noise.SetCellularReturnType(FastNoise::CellularReturnType::Distance2Div); break;
		}
		noise.SetCellularJitter(cellularJitter);
		noise.SetGradientPerturbAmp(gradientPerturbAmp);
	}
	
	float GetNoise(float x, float y)
	{
		noise.GetNoise(x, y);
	}
};
