using MiniHttpServer.Framework.Settings;
using MyORMLibrary;

namespace Tours.DAO;

public abstract class HasFactory
{
    protected IConnectionFactory connectionFactory =
        new ConnectionPostgresFactory(SettingsManager.Instance.Settings.ConnectionString);
}
