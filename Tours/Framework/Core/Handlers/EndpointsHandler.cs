using MiniHttpServer.Framework.Core.Abstracts;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using MiniHttpServer.Framework.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;

namespace MiniHttpServer.Framework.Core.Handlers
{
    public class EndpointsHandler : Handler
    {
        public override async Task HandleRequest(HttpListenerContext context, CancellationToken cancellationToken)
        {
            var request = context.Request;

            var urlSegments = request.Url!.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);

            var endPointName = urlSegments.Length > 0 ? urlSegments[0] : string.Empty;
            var actionName = urlSegments.Length > 1 ? urlSegments[1] : string.Empty;

            var assembly = Assembly.GetEntryAssembly();

            var endPoint = assembly.GetTypes()
                .Where(t => t.GetCustomAttribute<EndpointAttribute>() != null)
                .FirstOrDefault(e => IsCheckedNameEndpoint(e.Name, endPointName));

            string contentType = request.ContentType ?? string.Empty;

            if (endPoint == null)
            {
                await Successor.HandleRequest(context, cancellationToken);
                return;
            }

            var methods = endPoint.GetMethods()
                .Where(m => m.GetCustomAttributes(true)
                    .Any(attr => attr.GetType().Name.StartsWith("Http", StringComparison.OrdinalIgnoreCase)))
                .ToList();

            var method = FindMatchingMethod(methods, request, actionName);

            if (method == null)
            {
                await Successor.HandleRequest(context, cancellationToken);
                return;
            }

            bool isBaseEndpoint = endPoint.Assembly.GetTypes()
                .Any(t => typeof(EndpointBase).IsAssignableFrom(t) && !t.IsAbstract);

            var instanceEndpoint = Activator.CreateInstance(endPoint);

            if (isBaseEndpoint)
            {
                (instanceEndpoint as EndpointBase).SetContext(context);
            }

            // Получаем параметры метода
            var methodParameters = method.GetParameters();
            List<object> methodArgs = [];

            try
            {

                // Обрабатываем body в зависимости от Content-Type
                if (request.HasEntityBody)
                {
                    using StreamReader reader = new(request.InputStream, request.ContentEncoding);

                    if (contentType.Contains("application/json"))
                    {
                        // Обработка JSON
                        methodArgs = await ProcessJsonBody(reader, methodParameters, cancellationToken);
                    }
                    else if (contentType.Contains("application/x-www-form-urlencoded") ||
                                contentType.Contains("multipart/form-data"))
                    {
                        // Обработка form-data
                        methodArgs = await ProcessFormDataBody(reader, methodParameters, contentType, cancellationToken);
                    }
                    else
                    {
                        // По умолчанию обрабатываем как form-data
                        methodArgs = await ProcessFormDataBody(reader, methodParameters, contentType, cancellationToken);
                    }
                }
                else
                {
                    // Если body нет, создаем пустой список аргументов
                    methodArgs = new List<object>();
                }

                // Добавляем query-параметры для недостающих аргументов
                var queryParameters = request.QueryString;
                for (int i = methodArgs.Count; i < methodParameters.Length; i++)
                {
                    var param = methodParameters[i];
                    var value = queryParameters[param.Name];

                    if (value != null)
                    {
                        var convertedValue = ConvertParameter(value, param.ParameterType);
                        methodArgs.Add(convertedValue);
                    }
                    else if (param.HasDefaultValue)
                    {
                        methodArgs.Add(param.DefaultValue);
                    }
                    else
                    {
                        throw new ArgumentException($"Отсутствует значение для параметра: {param.Name}");
                    }
                }
            }
            catch (Exception)
            {
                await WriteResponseAsync(context, new NotFounded().Execute(context), cancellationToken);
                return;
            }

            // Проверяем, что все параметры заполнены
            if (methodArgs.Count != methodParameters.Length)
            {
                throw new ArgumentException($"Количество переданных аргументов ({methodArgs.Count}) не совпадает с ожидаемым ({methodParameters.Length})");
            }

            var ret = method.Invoke(instanceEndpoint, methodArgs.ToArray());

            context.Response.StatusCode = 200;

            if (ret is PageResult page)
            {
                await WriteResponseContentAsync(context, page.Execute(context), cancellationToken);
            }
            else if (ret is JsonResult json)
            {
                await WriteResponseContentAsync(context, json.Execute(context), cancellationToken);
            } 
            else if (ret is RedirectResult redirectResult)
            {
                redirectResult.Execute(context);
            }
            else if (ret is OkResult ok)
            {
                await WriteResponseContentAsync(context, ok.Execute(context), cancellationToken);
            }
            else if (ret is ErrorResult error)
            {
                await WriteResponseContentAsync(context, error.Execute(context), cancellationToken);
            }
            else if (ret is NotFounded notFounded)
            {
                await WriteResponseAsync(context, notFounded.Execute(context), cancellationToken);
            }
            else

            if (ret == null)
            {
                await Successor.HandleRequest(context, cancellationToken);
                return;
            }
        }

        private async Task<List<object>> ProcessJsonBody(StreamReader reader, ParameterInfo[] methodParameters, CancellationToken cancellationToken)
        {
            var methodArgs = new List<object>();

            try
            {
                string requestBody = await reader.ReadToEndAsync();
                if (!string.IsNullOrEmpty(requestBody))
                {
                    var jsonDocument = JsonDocument.Parse(requestBody);

                    // Если метод принимает один параметр и это объект - десериализуем весь JSON в этот объект
                    if (methodParameters.Length == 1 && methodParameters[0].ParameterType.IsClass && methodParameters[0].ParameterType != typeof(string))
                    {
                        var paramType = methodParameters[0].ParameterType;
                        var jsonObject = JsonSerializer.Deserialize(requestBody, paramType);
                        methodArgs.Add(jsonObject);
                    }
                    else
                    {
                        // Ищем значения для каждого параметра в JSON
                        foreach (var param in methodParameters)
                        {
                            if (jsonDocument.RootElement.TryGetProperty(param.Name, out JsonElement property))
                            {
                                var value = ConvertJsonElement(property, param.ParameterType);
                                methodArgs.Add(value);
                            }
                            else if (param.HasDefaultValue)
                            {
                                methodArgs.Add(param.DefaultValue);
                            }
                            else
                            {
                                throw new ArgumentException($"В JSON отсутствует свойство: {param.Name}");
                            }
                        }
                    }
                }
            }
            catch (JsonException ex)
            {
                throw new ArgumentException($"Ошибка парсинга JSON: {ex.Message}");
            }

            return methodArgs;
        }

        private async Task<List<object>> ProcessFormDataBody(StreamReader reader, ParameterInfo[] methodParameters, string contentType, CancellationToken cancellationToken)
        {
            var methodArgs = new List<object>();

            string requestBody = await reader.ReadToEndAsync();
            var formData = HttpUtility.ParseQueryString(requestBody);

            foreach (var param in methodParameters)
            {
                var value = formData[param.Name];

                if (value != null)
                {
                    var convertedValue = ConvertParameter(value, param.ParameterType);
                    methodArgs.Add(convertedValue);
                }
                else if (param.HasDefaultValue)
                {
                    methodArgs.Add(param.DefaultValue);
                }
                else
                {
                    throw new ArgumentException($"Отсутствует значение для параметра: {param.Name}");
                }
            }

            return methodArgs;
        }

        private object ConvertJsonElement(JsonElement element, Type targetType)
        {
            try
            {
                return element.ValueKind switch
                {
                    JsonValueKind.String => element.GetString(),
                    JsonValueKind.Number when targetType == typeof(int) => element.GetInt32(),
                    JsonValueKind.Number when targetType == typeof(long) => element.GetInt64(),
                    JsonValueKind.Number when targetType == typeof(double) => element.GetDouble(),
                    JsonValueKind.Number when targetType == typeof(decimal) => element.GetDecimal(),
                    JsonValueKind.True => true,
                    JsonValueKind.False => false,
                    JsonValueKind.Null => null,
                    _ => element.ToString()
                };
            }
            catch
            {
                // Если не удалось преобразовать стандартным способом, пробуем через десериализацию
                try
                {
                    return JsonSerializer.Deserialize(element.GetRawText(), targetType);
                }
                catch
                {
                    throw new ArgumentException($"Не удалось преобразовать JSON значение к типу {targetType.Name}");
                }
            }
        }

        private object ConvertParameter(string value, Type targetType)
        {
            if (targetType == typeof(string))
            {
                return value;
            }
            else if (targetType == typeof(int) && int.TryParse(value, out int intValue))
            {
                return intValue;
            }
            else if (targetType == typeof(long) && long.TryParse(value, out long longValue))
            {
                return longValue;
            }
            else if (targetType == typeof(double) && double.TryParse(value, out double doubleValue))
            {
                return doubleValue;
            }
            else if (targetType == typeof(bool) && bool.TryParse(value, out bool boolValue))
            {
                return boolValue;
            }
            else if (targetType == typeof(decimal) && decimal.TryParse(value, out decimal decimalValue))
            {
                return decimalValue;
            }
            else if (targetType.IsEnum)
            {
                return Enum.Parse(targetType, value, true);
            }
            else
            {
                throw new ArgumentException($"Не удалось преобразовать значение '{value}' к типу {targetType.Name}");
            }
        }

        private bool IsCheckedNameEndpoint(string endPointName, string className) =>
            endPointName.Equals(className, StringComparison.OrdinalIgnoreCase) ||
            endPointName.Equals($"{className}Endpoint", StringComparison.OrdinalIgnoreCase);

        private MethodInfo FindMatchingMethod(List<MethodInfo> methods, HttpListenerRequest request, string actionRoute)
        {
            var httpMethodAttributes = methods
                .SelectMany(m => m.GetCustomAttributes(true)
                    .Where(attr => attr.GetType().Name.Equals($"Http{request.HttpMethod}Attribute", StringComparison.OrdinalIgnoreCase))
                    .Select(attr => new { Method = m, Attribute = attr }))
                .ToList();

            if (string.IsNullOrEmpty(actionRoute))
            {
                return httpMethodAttributes
                    .FirstOrDefault(x =>
                        x.Attribute is HttpAttribute httpAttr &&
                        string.IsNullOrEmpty(httpAttr.Route))?
                    .Method;
            }
            else
            {
                return httpMethodAttributes
                    .FirstOrDefault(x =>
                        x.Attribute is HttpAttribute httpAttr &&
                        !string.IsNullOrEmpty(httpAttr.Route) &&
                        httpAttr.Route.Equals(actionRoute, StringComparison.OrdinalIgnoreCase))?
                    .Method;
            }
        }
    }
}