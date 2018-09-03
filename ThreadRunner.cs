using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

/*
 * ThreadRunner - Written by Jelle van der Gulik.
 * Abstract utility class used for a background thread or multi-threading.
 * 
 * Usage: Implement OnStart() OnTick() and OnStop() abstract functions. Start the thread runner with Start().
 */

namespace ZombieWars.com.jellevdg3.src
{
    abstract class ThreadRunner
    {
        private Thread thread;

        private bool hasThreadStarted;
        private bool isThreadRunning;
        private bool hasThreadStopped;
        private bool shouldThreadStop;

        private object threadDataLock;

        public ThreadRunner()
        {
            hasThreadStarted = false;
            isThreadRunning = false;
            hasThreadStopped = false;
            shouldThreadStop = false;
            
            thread = new Thread(new ThreadStart(OnThreadStart));
            threadDataLock = new object();
        }

        // IMPLEMENT:
        protected abstract void OnStart();
        protected abstract void OnTick();
        protected abstract void OnStop();
        
        // Start the thread runner.
        public void Start()
        {
            lock (threadDataLock)
            {
                if (!hasThreadStarted)
                {
                    hasThreadStarted = true;
                    thread.Start();
                }
            }
        }

        // Is the thread runner running? (thread-context-safe)
        public bool IsRunning()
        {
            lock (threadDataLock)
            {
                return !isThreadRunning;
            }
        }

        // Is the thread runner running? (not thread-context-safe, be careful when using this function from another thread for race-conditions)
        public bool UnsafeIsRunning()
        {
            return !isThreadRunning;
        }

        // Stop the thread runner.
        public void Stop()
        {
            shouldThreadStop = true;
        }
        
        // Obtain the thread context.
        public Thread GetThread()
        {
            return thread;
        }

        // [PRIVATE EVENT]: Executed when the thread is started after Start() is executed.
        private void OnThreadStart()
        {
            try
            {
                OnStart();

                lock (threadDataLock)
                {
                    isThreadRunning = true;
                }

                // Thread running loop.
                while (!shouldThreadStop)
                {
                    OnTick();
                }
                
                lock (threadDataLock)
                {
                    isThreadRunning = false;
                }
            }
            catch (Exception e)
            {
                // Pass error to application.
                Application.GetLogger().Error(e.ToString());
            }

            Stop();
            OnStop();
            
            lock (threadDataLock)
            {
                hasThreadStopped = true;
            }
        }
    }
}
