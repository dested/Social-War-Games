sudo su
mkdir -p /tmp/mono_dependencies
cd /tmp/mono_dependencies
wget http://dl.fedoraproject.org/pub/fedora/linux/development/rawhide/Everything/x86_64/os/Packages/l/libpng15-1.5.26-2.fc24.x86_64.rpm
yum install -y ~/downloads/mono_dependencies/libpng15-1.5.23-1.fc24.x86_64.rpm

yum install yum-utils
rpm --import "http://keyserver.ubuntu.com/pks/lookup?op=get&search=0x3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF"
yum-config-manager --add-repo http://download.mono-project.com/repo/centos/
yum install mono-core