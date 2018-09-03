#pragma once

/*
 * Delegate - Written by Jelle van der Gulik.
 * Delegate function to execute any function of any class. IDelegate allows to declare the variable in the header without a template.
 * 
 * Usage header:
 * IDelegate* delegate;
 * 
 * Usage source:
 * delegate = new Delegate<SomeClass>(someInstance, &SomeClass::SomeFunction);
 * delegate->Execute();
 */

class IDelegate
{
public:
    IDelegate() {};
    virtual ~IDelegate() {};
    virtual void Execute() = 0;
};

template<class T>
class Delegate : public IDelegate
{
public:
    typedef void (T::*EventFunc)();
    T* mInstance;
    EventFunc mFunction;

    Delegate(T* aInstance, EventFunc aFunction)
    {
        this->mInstance = aInstance;
        this->mFunction = aFunction;
    }

    ~Delegate()
    {
    }

    void Execute() override
    {
        (mInstance->*mFunction)();
    }
};
