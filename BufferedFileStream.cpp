#include "BufferedFileStream.h"

#include <fstream>
#include <ostream>

// PIMPL of the BufferedFileStream Data.
struct BufferedFileStreamData
{
    std::string mFilePath;

    unsigned long mTotalWrittenBytes;
    unsigned long mTotalReadBytes;

    unsigned int mBufferSize;
    unsigned char* mBuffer;

    int mErrorCode;

    std::ifstream mInStream;
    std::ofstream mOutStream;

    int mBufferIndex;
    int mBufferLength;
};

// Relative or absolute path to an existing or non-existing file. Recommended buffer size: 8192.
BufferedFileStream::BufferedFileStream(char* aFilePath, unsigned int aBufferSize)
{
    mData = new BufferedFileStreamData();

    mData->mFilePath = aFilePath;
    mData->mBuffer = new unsigned char[aBufferSize];
    mData->mBufferSize = aBufferSize;

    mData->mTotalWrittenBytes = 0;
    mData->mTotalReadBytes = 0;

    mData->mErrorCode = 0;

    mData->mBufferIndex = 0;
    mData->mBufferLength = 0;
}

BufferedFileStream::~BufferedFileStream()
{
    if (mData)
    {
        delete mData->mBuffer;
        delete mData;
    }
    mData = 0;
}

// Check if there has been an error, and obtain the error code.
int BufferedFileStream::GetErrorCode()
{
    return mData->mErrorCode;
}

// Create the file if it does not exist.
void BufferedFileStream::Create()
{
    std::ofstream tmpFile(mData->mFilePath, std::ios::binary);
    tmpFile.close();
}

/// Read Functions ///
// Open the file stream for reading. Execute this before any read functions.
void BufferedFileStream::OpenRead()
{
    mData->mInStream.open(mData->mFilePath, std::ios::in | std::ios::binary);
    if (mData->mInStream.is_open())
    {
        mData->mInStream.seekg(0, std::ios::beg);
    }
    else
    {
        mData->mErrorCode = 1;
    }
}

// Read a 8-bit signed character.
char BufferedFileStream::ReadChar()
{
    while (mData->mBufferIndex == mData->mBufferLength)
    {
        ReadBlock();
    }

    char d = mData->mBuffer[mData->mBufferIndex];
    mData->mBufferIndex++;
    return d;
}

// Read a 8 bit unsigned character.
unsigned char BufferedFileStream::ReadUChar()
{
    return (unsigned char)(ReadChar());
}

// Read a 16-bit signed short.
short BufferedFileStream::ReadShort()
{
    short d;
    ReadReversed(&d, sizeof(short));
    return d;
}

// Read a 16-bit unsigned short.
unsigned short BufferedFileStream::ReadUShort()
{
    unsigned short d;
    ReadReversed(&d, sizeof(unsigned short));
    return d;
}

// Read a 32-bit signed integer.
int BufferedFileStream::ReadInt()
{
    int d;
    ReadReversed(&d, sizeof(int));
    return d;
}

// Read a 32-bit unsigned integer.
unsigned int BufferedFileStream::readUInt()
{
    unsigned int d;
    ReadReversed(&d, sizeof(unsigned int));
    return d;
}

// Read a 64-bit signed integer.
long BufferedFileStream::ReadLong()
{
    long d;
    ReadReversed(&d, sizeof(long));
    return d;
}

// Read a 64-bit unsigned integer.
unsigned long BufferedFileStream::ReadULong()
{
    unsigned long d;
    ReadReversed(&d, sizeof(unsigned long));
    return d;
}

// Read a 32-bit float.
float BufferedFileStream::ReadFloat()
{
    float d;
    ReadReversed(&d, sizeof(float));
    return d;
}

// Read a 64-bit double.
double BufferedFileStream::ReadDouble()
{
    double d;
    ReadReversed(&d, sizeof(double));
    return d;
}

// Read a VarInt (packed integer, amount of bytes depend on the number).
int BufferedFileStream::ReadVarInt()
{
    unsigned char data[4];

    unsigned int size = 0;
    do
    {
        if (size == 4)
            return -1;
        data[size++] = this->ReadUChar();
    } while (data[size - 1] & 0x80);

    unsigned int num = 0;
    for (int i = size - 1; i >= 0; i--)
    {
        num <<= 7;
        num |= (data[i] & 0x7F);
    }

    return num;
}

// Read a string of characters (prefixed with an integer with a string count).
std::string BufferedFileStream::ReadString()
{
    int l = ReadVarInt();
    return std::string(ReadArray(l), l);
}

// Read an array of a set amount of signed characters.
char* BufferedFileStream::ReadArray(int aLength)
{
    char* d = new char[aLength];
    for (int i = 0; i < aLength; i++)
    {
        d[i] = this->ReadChar();
    }
    return d;
}

// Read an array of a set amount of unsigned characters.
unsigned char* BufferedFileStream::ReadArray(int aLength)
{
    unsigned char* d = new char[aLength];
    for (int i = 0; i < aLength; i++)
    {
        d[i] = this->ReadUChar();
    }
    return d;
}

// Obtain the amount of bytes a VarInt uses depending on the number.
int BufferedFileStream::GetVarIntLength(int aVarInt)
{
    if (aVarInt > 0x7F7F7F)
        return 4;
    else if (aVarInt > 0x7F7F)
        return 3;
    else if (aVarInt > 0x7F)
        return 2;
    return 1;
}

// Get the amount of bytes of a string (including prefix).
int BufferedFileStream::GetStringLength(std::string aString)
{
    return GetVarIntLength((int)(aString.length())) + (int)(aString.length());
}

// Obtain the total amount of bytes read from the file.
long BufferedFileStream::GetTotalReadBytes()
{
    return mData->mTotalReadBytes - mData->mBufferLength + mData->mBufferIndex;
}

/// Write Functions ///
// Open the file stream for writing. Execute this before any write functions.
void BufferedFileStream::OpenWrite()
{
    mData->mOutStream.open(mData->mFilePath, std::ios::out | std::ofstream::trunc | std::ios::binary);
    if (!mData->mOutStream.is_open())
    {
        mData->mErrorCode = 2;
    }
}

// Write a 8-bit signed character.
void BufferedFileStream::WriteChar(char aChar)
{
    while (mData->mBufferIndex == mData->mBufferSize)
    {
        Flush();
    }

    mData->mBuffer[mData->mBufferIndex] = aChar;
    mData->mBufferIndex++;
}

// Write a 8-bit unsigned character.
void BufferedFileStream::WriteUChar(unsigned char aUChar)
{
    WriteChar((unsigned char)(aUChar));
}

// Write a 16-bit signed character.
void BufferedFileStream::WriteShort(short aShort)
{
    WriteReversed(&aShort, sizeof(short));
}

// Write a 16-bit unsigned character.
void BufferedFileStream::WriteUShort(unsigned short aUShort)
{
    WriteReversed(&aUShort, sizeof(unsigned short));
}

// Write a 32-bit signed character.
void BufferedFileStream::WriteInt(int aInt)
{
    WriteReversed(&aInt, sizeof(int));
}

// Write a 32-bit unsigned character.
void BufferedFileStream::WriteUInt(unsigned int aUInt)
{
    WriteReversed(&aUInt, sizeof(unsigned int));
}

// Write a 64-bit signed long.
void BufferedFileStream::WriteLong(long aLong)
{
    WriteReversed(&aLong, sizeof(long));
}

// Write a 64-bit unsigned long.
void BufferedFileStream::WriteULong(unsigned long aULong)
{
    WriteReversed(&aULong, sizeof(unsigned long));
}

// Write a 32-bit float.
void BufferedFileStream::WriteFloat(float aFloat)
{
    WriteReversed(&aFloat, sizeof(float));
}

// Write a 64-bit double.
void BufferedFileStream::WriteDouble(double aDouble)
{
    WriteReversed(&aDouble, sizeof(double));
}

// Write a VarInt (packed integer, amount of bytes depend on the number).
void BufferedFileStream::WriteVarInt(int aVarInt)
{
    if (aVarInt == 0)
    {
        WriteChar(0);
        return;
    }

    for (int i = 0; aVarInt; i++)
    {
        unsigned char b = aVarInt & 0x7F;
        aVarInt >>= 7;
        if (aVarInt)
            b |= 0x80;

        WriteChar(b);
    }
}

// Write a string of characters (prefixed with an integer with the string count).
void BufferedFileStream::WriteString(std::string aString)
{
    int l = (int)(aString.length());
    WriteVarInt(l);
    for (char c : aString)
    {
        WriteChar(c);
    }
}

// Write an array of a set amount of characters.
void BufferedFileStream::WriteArray(char* aArray, int aLength)
{
    Write(aArray, aLength);
}

// Write an array of a set amount of unsigned characters.
void BufferedFileStream::WriteUArray(unsigned char* aArray, int aLength)
{
    Write(aArray, aLength);
}

// Flush the data. Makes sure all data is written and buffers are empty.
void BufferedFileStream::Flush()
{
    if (mData->mBufferIndex > 0)
    {
        mData->mOutStream.write((char*)(mData->mBuffer), mData->mBufferIndex).flush();
        if (!mData->mOutStream.fail())
        {
            mData->mTotalWrittenBytes += mData->mBufferIndex;
        }
        else
        {
            mData->mErrorCode = 31;
        }

        mData->mBufferIndex = 0;
    }
}

// Obtain the total amount of bytes written to the file.
long BufferedFileStream::GetTotalWrittenBytes()
{
    return mData->mTotalWrittenBytes;
}

// Close the file stream.
void BufferedFileStream::Close()
{
    mData->mInStream.close();
    mData->mOutStream.close();
}

/// Utility functions for reading/writing data ///
void BufferedFileStream::ReadBlock()
{
    mData->mBufferIndex = 0;
    mData->mBufferLength = (int)(mData->mInStream.read((char*)(mData->mBuffer), mData->mBufferSize).gcount());
    if (mData->mBufferLength <= 0)
    {
        mData->mBufferLength = mData->mBufferSize;

        // error
        mData->mErrorCode = 30;
    }
    else
    {
        mData->mTotalReadBytes += mData->mBufferLength;
    }
}

void BufferedFileStream::Read(void* aPtr, int aLength)
{
    char* d = (char*)(aPtr);
    for (int i = 0; i < aLength; i++)
    {
        d[i] = this->ReadChar();
    }
}

void BufferedFileStream::ReadReversed(void* aPtr, int aLength)
{
    char* d = (char*)(aPtr);
    for (int i = aLength - 1; i >= 0; i--)
    {
        d[i] = this->ReadChar();
    }
}

void BufferedFileStream::Write(void* aPtr, int aLength)
{
    char* d = (char*)(aPtr);
    for (int i = 0; i < aLength; i++)
    {
        this->WriteChar(d[i]);
    }
}

void BufferedFileStream::WriteReversed(void* aPtr, int aLength)
{
    char* d = (char*)(aPtr);
    for (int i = aLength - 1; i >= 0; i--)
    {
        this->WriteChar(d[i]);
    }
}
