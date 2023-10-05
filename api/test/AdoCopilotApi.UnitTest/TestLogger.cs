using Fare;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdoCopilotApi.UnitTest
{
    internal class TestLogger : ILogger
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull
        {
            return NullLogger.Instance.BeginScope(state);
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return NullLogger.Instance.IsEnabled(logLevel);
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            NullLogger.Instance.Log(logLevel, eventId, state, exception, formatter);
            Console.WriteLine($"Level: {logLevel}, EventId: {eventId}, State: {state}");
        }
    }

    internal class TestLogger<T> : TestLogger, ILogger<T>
    {

    }
}
