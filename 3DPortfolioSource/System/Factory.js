// Factory class registers objects before initialization
// Which is why it has to be initialized before any other code is executed
// The HighPriority command is a directive that makes sure that happens.

//#HighPriority

Factory = function() { }

// Factories
Factory.SystemComponents = [];

Factory.Projects = [];

// Functionality
Factory.Add = function(factory, obj)
{
    factory.push(obj);
}
