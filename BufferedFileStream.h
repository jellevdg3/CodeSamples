#pragma once

#include <string>

/* 
 * BufferedFileStream - Written by Jelle van der Gulik
 * Useful when reading or writing binary data to a file.
 *
 * Example usage:
 * BufferedFileStream stream("Testfile.data", 8192);
 * stream.OpenRead();
 * int dataNumber = stream.ReadInt();
 * stream.Close();
 */

class BufferedFileStream
{
public:
	// Relative or absolute path to an existing or non-existing file. Recommended buffer size: 8192.
    BufferedFileStream(char* aFilePath, unsigned int aBufferSize);
    ~BufferedFileStream();
	
	// Check if there has been an error, and obtain the error code.
    int GetErrorCode();
	
	// Create the file if it does not exist.
    void Create();
	
    //// Read Functions ////
	
	// Open the file stream for reading. Execute this before any read functions.
	void OpenRead();
	
	// Read a 8-bit signed character.
    char ReadChar();
	// Read a 8 bit unsigned character.
    unsigned char ReadUChar();
	// Read a 16-bit signed short.
    short ReadShort();
	// Read a 16-bit unsigned short.
    unsigned short ReadUShort();
	// Read a 32-bit signed integer.
    int ReadInt();
	// Read a 32-bit unsigned integer.
    unsigned int readUInt();
	// Read a 64-bit signed integer.
    long ReadLong();
	// Read a 64-bit unsigned integer.
    unsigned long ReadULong();
	// Read a 32-bit float.
    float ReadFloat();
	// Read a 64-bit double.
    double ReadDouble();
	// Read a VarInt (packed integer, amount of bytes depend on the number).
    int ReadVarInt();
	// Read a string of characters (prefixed with an integer with a string count).
    std::string ReadString();
	// Read an array of a set amount of signed characters.
    char* ReadArray(int aLength);
	// Read an array of a set amount of unsigned characters.
    unsigned char* ReadUArray(int aLength);
	
	// Obtain the amount of bytes a VarInt uses depending on the number.
    int GetVarIntLength(int aVarInt);
	// Get the amount of bytes of a string (including prefix).
    int GetStringLength(std::string aString);
	
	// Obtain the total amount of bytes read from the file.
    long GetTotalReadBytes();
	
    //// Write Functions ////
	
	// Open the file stream for writing. Execute this before any write functions.
	void OpenWrite();
	
	// Write a 8-bit signed character.
    void WriteChar(char aChar);
	// Write a 8-bit unsigned character.
    void WriteUChar(unsigned char aUChar);
	// Write a 16-bit signed character.
    void WriteShort(short aShort);
	// Write a 16-bit unsigned character.
    void WriteUShort(unsigned short aUShort);
	// Write a 32-bit signed character.
    void WriteInt(int aInt);
	// Write a 32-bit unsigned character.
    void WriteUInt(unsigned int aUInt);
	// Write a 64-bit signed long.
    void WriteLong(long aLong);
	// Write a 64-bit unsigned long.
    void WriteULong(unsigned long aULng);
	// Write a 32-bit float.
    void WriteFloat(float aFloat);
	// Write a 64-bit double.
    void WriteDouble(double aDouble);
	// Write a VarInt (packed integer, amount of bytes depend on the number).
    void WriteVarInt(int aVarInt);
	// Write a string of characters (prefixed with an integer with the string count).
    void WriteString(std::string aString);
	// Write an array of a set amount of characters.
    void WriteArray(char* aArray, int aLength);
	// Write an array of a set amount of unsigned characters.
    void WriteUArray(unsigned char* aArray, int aLength);
	
	// Flush the data. Makes sure all data is written and buffers are empty.
    void Flush();
	// Obtain the total amount of bytes written to the file.
    long GetTotalWrittenBytes();
	// Close the file stream.
	void Close();
	
private:
	// PIMPL of private data. Implemented in BufferedfileStream.cpp.
    struct BufferedFileStreamData* mData;
	
	/// Utility functions for reading/writing data ///
    void ReadBlock();
    void Read(void* aPtr, int aLength);
    void ReadReversed(void* aPtr, int aLength);
	
    void Write(void* aPtr, int aLength);
    void WriteReversed(void* aPtr, int aLength);
};
